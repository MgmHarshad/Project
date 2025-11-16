import { useEffect, useRef, useState } from "react";

const LocationPicker = ({ setLocation, isVisible, onClose }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Reverse geocoding function to convert coordinates to address
  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'FeedConnect App'
          }
        }
      );
      const data = await response.json();
      
      if (data && data.address) {
        // Build a readable address string
        const addr = data.address;
        const parts = [];
        
        if (addr.house_number || addr.road) {
          parts.push([addr.house_number, addr.road].filter(Boolean).join(' '));
        }
        if (addr.suburb || addr.neighbourhood) {
          parts.push(addr.suburb || addr.neighbourhood);
        }
        if (addr.city || addr.town || addr.village) {
          parts.push(addr.city || addr.town || addr.village);
        }
        if (addr.state || addr.region) {
          parts.push(addr.state || addr.region);
        }
        if (addr.postcode) {
          parts.push(addr.postcode);
        }
        
        return parts.length > 0 ? parts.join(', ') : data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      }
      return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  useEffect(() => {
    if (!isVisible || !window.L) {
      return;
    }

    if (mapRef.current && isInitialized) {
      // If map is already initialized, just invalidate size to refresh
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
        }
      }, 100);
      return;
    }
    if (!mapContainerRef.current) return;

    const L = window.L;
    const map = L.map(mapContainerRef.current, {
      center: [12.9716, 77.5946],
      zoom: 11,
      zoomControl: true,
    });
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    function placeOrMoveMarker(lat, lng) {
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng]).addTo(map);
      }
    }

    const handleMapClick = async (e) => {
      const { lat, lng } = e.latlng;
      placeOrMoveMarker(lat, lng);
      
      // Reverse geocode to get address
      const address = await reverseGeocode(lat, lng);
      setLocation({ 
        latitude: lat, 
        longitude: lng,
        address: address 
      });
    };

    map.on("click", handleMapClick);

    // Try to center on user's current location for convenience (non-blocking)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          map.setView([latitude, longitude], 13);
        },
        () => {
          // ignore errors; keep default view
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }

    setIsInitialized(true);

    return () => {
      if (mapRef.current) {
        map.off("click", handleMapClick);
        map.remove();
        mapRef.current = null;
        markerRef.current = null;
        setIsInitialized(false);
      }
    };
  }, [isVisible, setLocation]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-4 m-4 max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Select Pickup Location</h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        <div 
          ref={mapContainerRef}
          className="w-full h-80 rounded-xl border-2 border-gray-300"
        ></div>
        <div className="mt-4 text-sm text-gray-600">
          Click on the map to select your pickup location
        </div>
        <button
          onClick={onClose}
          className="mt-4 bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-900"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default LocationPicker;
