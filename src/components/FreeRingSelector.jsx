"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { generateProductSlug } from "../utils/slugify";

import { apiUrl } from "@/lib/apiBase";
const FreeRingSelector = ({ onSelect, selectedRingId, onClose }) => {
  // onSelect will now receive (ringId, ringName)
  const [rings, setRings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const fetchRings = async () => {
      try {
        const response = await fetch(
          apiUrl("/promotion/free-ring/status")
        );
        const data = await response.json();

        if (data.active) {
          setIsActive(true);
          setRings(data.rings || []);
        } else {
          setIsActive(false);
        }
      } catch (error) {
        console.error("Error fetching free rings:", error);
        setIsActive(false);
      } finally {
        setLoading(false);
      }
    };

    fetchRings();
  }, []);

  if (loading) {
    return (
      <div className="free-ring-modal-overlay">
        <div className="free-ring-modal">
          <div className="text-center p-4">Loading rings...</div>
        </div>
      </div>
    );
  }

  if (!isActive) {
    return null; // Promotion ended
  }

  return (
    <div className="free-ring-modal-overlay" onClick={onClose}>
      <div className="free-ring-modal" onClick={(e) => e.stopPropagation()}>
        <div className="free-ring-modal-header">
          <h3>🎁 Select Your Free Ring!</h3>
          <button className="free-ring-close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="free-ring-modal-body">
          <p className="free-ring-description">
            Congratulations! You qualify for a <strong>FREE RING</strong> with your order above ₹1000.
            Select one ring below:
          </p>
          {rings.length === 0 ? (
            <div className="text-center p-4">
              <p>No rings available at the moment.</p>
            </div>
          ) : (
            <div className="free-ring-grid">
              {rings.map((ring) => (
                <div
                  key={ring.product_id}
                  className={`free-ring-card ${
                    selectedRingId === ring.product_id ? "selected" : ""
                  }`}
                  onClick={() => onSelect(ring.product_id, ring.name)}
                >
                  <div className="free-ring-image-wrapper">
                    <img
                      src={ring.image || "https://via.placeholder.com/150"}
                      alt={ring.name}
                      className="free-ring-image"
                    />
                    {selectedRingId === ring.product_id && (
                      <div className="free-ring-selected-badge">✓ Selected</div>
                    )}
                  </div>
                  <div className="free-ring-info">
                    <h5 className="free-ring-name">{ring.name}</h5>
                    <p className="free-ring-price">
                      <span className="original-price">₹{ring.price}</span>
                      <span className="free-badge">FREE</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {selectedRingId && (
            <div className="free-ring-footer">
              <button className="free-ring-confirm-btn" onClick={onClose}>
                Confirm Selection
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .free-ring-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 20px;
        }

        .free-ring-modal {
          background: #fff;
          border-radius: 12px;
          max-width: 900px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }

        .free-ring-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 2px solid #f0f0f0;
        }

        .free-ring-modal-header h3 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
          color: #000;
        }

        .free-ring-close-btn {
          background: none;
          border: none;
          font-size: 32px;
          color: #666;
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
        }

        .free-ring-close-btn:hover {
          color: #000;
        }

        .free-ring-modal-body {
          padding: 24px;
        }

        .free-ring-description {
          font-size: 16px;
          color: #333;
          margin-bottom: 24px;
          text-align: center;
        }

        .free-ring-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .free-ring-card {
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #fff;
        }

        .free-ring-card:hover {
          border-color: #ff3f6c;
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .free-ring-card.selected {
          border-color: #ff3f6c;
          background: #fff5f7;
        }

        .free-ring-image-wrapper {
          position: relative;
          width: 100%;
          height: 200px;
          margin-bottom: 12px;
          background: #f5f5f6;
          border-radius: 6px;
          overflow: hidden;
        }

        .free-ring-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .free-ring-selected-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background: #ff3f6c;
          color: #fff;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }

        .free-ring-info {
          text-align: center;
        }

        .free-ring-name {
          font-size: 14px;
          font-weight: 500;
          color: #333;
          margin-bottom: 8px;
          min-height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .free-ring-price {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .original-price {
          font-size: 14px;
          color: #999;
          text-decoration: line-through;
        }

        .free-badge {
          background: #03a685;
          color: #fff;
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .free-ring-footer {
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid #f0f0f0;
        }

        .free-ring-confirm-btn {
          background: #ff3f6c;
          color: #fff;
          border: none;
          padding: 12px 32px;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .free-ring-confirm-btn:hover {
          background: #ff1f4f;
        }

        @media (max-width: 768px) {
          .free-ring-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 12px;
          }

          .free-ring-modal {
            max-height: 95vh;
          }

          .free-ring-modal-header h3 {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default FreeRingSelector;

