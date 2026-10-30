
import React from "react";

const Footer = () => {
  return (
    <footer
      style={{
        background: "#0a1628",
        borderTop: "1px solid rgba(56,189,208,0.2)",
        color: "#fff",
      }}
    >
      <div
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          padding: "2rem 1.5rem",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1.25rem",
        }}
      >
        {/* Logo */}
        <img
          src="/Images/logo.png"
          alt="ExportYard logo"
          style={{ height: "2.5rem", width: "auto" }}
        />

        {/* Links */}
        <div>
          <a
            href="/privacy-policy"
            style={{
              color: "#38bdd0",
              textDecoration: "none",
              fontWeight: 600,
              marginRight: "1rem",
            }}
          >
            Privacy Policy
          </a>

          <a
            href="/terms"
            style={{
              color: "#38bdd0",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Terms of Service
          </a>
        </div>

        {/* Enquiry */}
        <div style={{ fontSize: "0.95rem", lineHeight: 1.5 }}>
          <div style={{ color: "rgba(255,255,255,0.65)" }}>
            For enquiries, write to us at
          </div>

          <a
            href="mailto:contact@exportyard.com"
            style={{
              color: "#38bdd0",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            contact@exportyard.com
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
