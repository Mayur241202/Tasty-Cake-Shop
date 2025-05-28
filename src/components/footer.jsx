const Footer = () => {
    return (
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center sm:text-left">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3">About Your Project</h3>
              <p className="text-gray-400 text-sm sm:text-base">
              MyBook connects readers to buy, sell, and share books effortlessly. Promote affordable learning, reduce waste, and give books a second life.            </p>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3">Quick Links</h3>
              <ul className="text-gray-400 text-sm sm:text-base space-y-2">
                <li><a href="/Home" className="hover:text-green-400 transition-colors">Home</a></li>
                <li><a href="/About" className="hover:text-green-400 transition-colors">About</a></li>
                <li><a href="/Login" className="hover:text-green-400 transition-colors">How It Works</a></li>
                <li><a href="/Contact" className="hover:text-green-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3">Follow Us</h3>
              <div className="flex justify-center sm:justify-start space-x-4">
              <div className="flex space-x-6">
    <a href="https://github.com/Ketanjedhe" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-3xl">
      {/* GitHub SVG */}
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.6.113.793-.258.793-.577 0-.285-.01-1.04-.016-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.755-1.333-1.755-1.089-.744.083-.729.083-.729 1.205.084 1.838 1.238 1.838 1.238 1.07 1.835 2.807 1.305 3.492.997.108-.775.418-1.305.762-1.605-2.667-.305-5.466-1.333-5.466-5.932 0-1.311.469-2.382 1.237-3.221-.124-.304-.536-1.527.117-3.184 0 0 1.008-.322 3.3 1.23a11.511 11.511 0 013-.404c1.02.005 2.046.137 3 .404 2.291-1.553 3.297-1.23 3.297-1.23.655 1.657.243 2.88.12 3.184.77.839 1.236 1.91 1.236 3.221 0 4.61-2.803 5.625-5.475 5.92.43.372.815 1.103.815 2.225 0 1.605-.014 2.898-.014 3.292 0 .322.192.694.8.576C20.565 22.094 24 17.595 24 12.297c0-6.627-5.373-12-12-12z"/>
      </svg>
    </a>
  
    <a href="https://www.instagram.com/ketan_jedhe_9890?igsh=MWxwcmJ5d3Y0bDlsZQ==" 
     target="_blank" 
     rel="noopener noreferrer" 
     className="text-gray-400 hover:text-pink-500 transition-colors duration-300 text-3xl">
      
      {/* Instagram SVG */}
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
        <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zM12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 1.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.25-2.75a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-1.5 0v-.5a.75.75 0 0 1 .75-.75z"/>
      </svg>
  </a>
  
  
    <a href="https://www.linkedin.com/in/ketan-jedhe-390501290?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" className="text-gray-400 hover:text-blue-700 transition-colors duration-300 text-3xl">
      {/* LinkedIn SVG */}
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
        <path d="M22.225 0H1.771C.792 0 0 .774 0 1.727v20.545C0 23.226.792 24 1.771 24h20.454C23.207 24 24 23.226 24 22.273V1.727C24 .774 23.207 0 22.225 0zM7.162 20.452H3.662V9h3.5v11.452zM5.412 7.727c-1.122 0-2.034-.91-2.034-2.034s.912-2.034 2.034-2.034c1.123 0 2.035.91 2.035 2.034s-.912 2.034-2.035 2.034zm15.04 12.725h-3.5v-5.652c0-1.348-.027-3.084-1.882-3.084-1.884 0-2.173 1.473-2.173 2.992v5.744h-3.5V9h3.36v1.561h.047c.468-.89 1.608-1.833 3.31-1.833 3.542 0 4.198 2.333 4.198 5.366v6.357z"/>
      </svg>
    </a>
  </div>
  
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-6 pt-4 text-center text-gray-500 text-sm sm:text-base">
            © 2025 Tasty Cake and Bakers. All rights reserved.
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  