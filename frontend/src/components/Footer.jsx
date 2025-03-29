import { FaTwitter, FaInstagram, FaYoutube, FaGithub } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-left">
        <p>&copy; 2025 MMZG</p>
      </div>
      <div className="footer-center">
        <nav className="footer-icons" aria-label="Social Media Links">
          <a href="#" aria-label="Twitter">
            <FaTwitter />
          </a>
          <a href="#" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a href="#" aria-label="YouTube">
            <FaYoutube />
          </a>
          <a href="#" aria-label="LinkedIn">
            <FaGithub />
          </a>
        </nav>
      </div>
      <div className="footer-right">
        <p>© All rights reserved</p>
      </div>
    </footer>
  )
}

export default Footer
