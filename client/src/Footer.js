// client/src/Footer.js
import React from 'react';
import { FaInstagram, FaWhatsapp, FaTwitter, FaLinkedin, FaXing } from 'react-icons/fa';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light mt-auto" style={{ marginTop: 'auto' }}>
      <div className="container py-4">
        <div className="row">
          {/* Left Column: Company Info */}
          <div className="col-md-4 text-start">
            <h4 className="mb-2">FinHER</h4>
            <p className="mb-1 fw-bold">Empowering Women Entrepreneurs</p>
            <p className="fst-italic">"Your Bridge to Financial Freedom"</p>
          </div>

          {/* Middle Column: Contact Info */}
          <div className="col-md-4 text-start">
            <h5 className="mb-2">Contact Us</h5>
            <p className="mb-1">123 FinHER Street, Mumbai, Maharashtra</p>
            <p className="mb-1">Email: projects5423@gmail.com</p>
            <p>Phone: +91 885022122</p>
          </div>

          {/* Right Column: Social Icons */}
          <div className="col-md-4 text-end">
            <h5 className="mb-2">Follow Us</h5>
            <div className="d-flex justify-content-end align-items-center gap-3">
              <a
                href="https://instagram.com/finher"
                className="text-light"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://wa.me/1234567890"
                className="text-light"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp size={24} />
              </a>
              <a
                href="https://twitter.com/finher"
                className="text-light"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="https://linkedin.com/company/finher"
                className="text-light"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin size={24} />
              </a>
              {/* Placeholder for X (using FaXing) */}
              <a
                href="https://x.com/finher"
                className="text-light"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaXing size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Horizontal rule & Copyright */}
        <hr className="my-4" />
        <div className="row">
          <div className="col text-center">
            <p className="mb-0">&copy; {currentYear} FinHER. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
