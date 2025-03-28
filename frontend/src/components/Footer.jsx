import '../index.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        <p>@2025 MMZG</p>
      </div>

      <div className="footer-center">
        <div className="footer-icons">
          <a href="#"><i className="fa-brands fa-x-twitter"></i></a>
          <a href="#"><i className="fa-brands fa-instagram"></i></a>
          <a href="#"><i className="fa-brands fa-youtube"></i></a>
          <a href="#"><i className="fa-brands fa-linkedin"></i></a>
        </div>
      </div>

      <div className="footer-right">
        <p>© All rights reserved</p>
      </div>
    </footer>
  )
}

export default Footer
