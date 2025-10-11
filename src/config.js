const config = {
  apiUrl:
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://travily-backend.onrender.com",
};

export default config;
