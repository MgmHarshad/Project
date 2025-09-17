import axios from "axios";

// Calls the ML service to predict spoilage risk and remaining time
// Expects req.body to contain at least: foodName, and either hoursSincePrepared or preparedAt
// - If hoursSincePrepared is missing but preparedAt is provided, we derive hours since prepared from it
// - If both are missing, we default to 0 (just prepared)
// Populates req.mlPrediction = { spoilage_risk, remaining_fresh_hours }
export const mlPredictionMiddleware = async (req, res, next) => {
  try {
    const ML_API_URL = process.env.ML_API_URL || "http://127.0.0.1:5000/predict";

    const { foodName, hoursSincePrepared, preparedAt } = req.body || {};

    if (!foodName) {
      return res.status(400).json({ message: "foodName is required for prediction" });
    }

    // Derive hours since prepared
    let hours = 0;
    if (typeof hoursSincePrepared === "number") {
      hours = hoursSincePrepared;
    } else if (preparedAt) {
      const preparedTime = new Date(preparedAt).getTime();
      if (!isNaN(preparedTime)) {
        const diffMs = Date.now() - preparedTime;
        hours = Math.max(0, Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100);
      }
    }

    // Prepare payload for ML model
    const payload = {
      food_type: foodName,
      hours_since_prepared: hours,
    };

    const { data } = await axios.post(ML_API_URL, payload, { timeout: 5000 });

    // Validate response
    if (
      !data ||
      typeof data.spoilage_risk !== "string" ||
      (data.remaining_fresh_hours !== null && typeof data.remaining_fresh_hours !== "number")
    ) {
      return res.status(502).json({ message: "Invalid response from ML service" });
    }

    req.mlPrediction = {
      spoilage_risk: data.spoilage_risk,
      remaining_fresh_hours: data.remaining_fresh_hours,
      model_input: payload,
    };

    return next();
  } catch (error) {
    // Fail open with graceful degradation: continue without ML but flag it
    console.error("ML middleware error:", error.message);
    req.mlPrediction = {
      spoilage_risk: undefined,
      remaining_fresh_hours: undefined,
      model_input: undefined,
      error: error.message,
    };
    return next();
  }
};


