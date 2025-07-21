import axios from 'axios';

const LoadPopup = ({ userId, onSelect }) => {
  const [maps, setMaps] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/dosemaps/${userId}`)
      .then(res => setMaps(res.data));
  }, []);

  return (
    <div className="popup">
      <h3>Select a saved dose map:</h3>
      {maps.map((map) => (
        <button key={map._id} onClick={() => onSelect(map)}>
          {map.name}
        </button>
      ))}
    </div>
  );
};

export default LoadPopup;
