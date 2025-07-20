'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const BASE_API =
  'https://web-backenddev-cont-001-ajath8a5beh9eycz.westeurope-01.azurewebsites.net/api/v1/cpov/vehicle';
const IMAGE_BASE = 'https://platform.seez.co/image/0x0/';

interface CarDetailProps {
  params: { vehicleNo: string };
}

export default function CarDetails({ params }: CarDetailProps) {
  const [car, setCar] = useState<any>(null);
  const [error, setError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await fetch(`${BASE_API}/${params.vehicleNo}`, {
          cache: 'no-store'
        });
        if (!res.ok) throw new Error('Car not found');
        const json = await res.json();
        setCar(json.data);
        setCurrentImageIndex(0);
      } catch {
        setError(true);
      }
    };
    fetchCar();
  }, [params.vehicleNo]);

  if (error)
    return <p className="text-center mt-10 text-red-500">Car not found.</p>;
  if (!car) return <p className="text-center mt-10">Loading car details...</p>;

  const images = car.images || [];
  const currentImage = images[currentImageIndex];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        {car.description || `${car.make} ${car.model}`}
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left side: Image carousel */}
        <div className="flex-1 relative rounded-lg overflow-auto shadow-md max-w-full max-h-[80vh]">
          {images.length > 0 ? (
            <>
              <img
                src={`${IMAGE_BASE}${currentImage}.webp`}
                alt={`Car image ${currentImageIndex + 1}`}
                className="rounded-lg cursor-pointer max-w-full h-auto"
                onClick={() => setIsModalOpen(true)}
              />

              {/* Navigation Buttons */}
              <button
                onClick={prevImage}
                className="absolute top-1/2 left-4 -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full shadow hover:bg-opacity-100"
                aria-label="Previous image"
                type="button"
              >
                ◀
              </button>
              <button
                onClick={nextImage}
                className="absolute top-1/2 right-4 -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full shadow hover:bg-opacity-100"
                aria-label="Next image"
                type="button"
              >
                ▶
              </button>
            </>
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-200 rounded-lg text-gray-400">
              No Images Available
            </div>
          )}
        </div>

        {/* Right side: Specifications */}
        <div className="flex-1 space-y-3 overflow-auto max-h-[80vh]">
          <p>
            <strong>VIN:</strong> {car.vin}
          </p>
          <p>
            <strong>Year:</strong> {car.year}
          </p>
          <p>
            <strong>Model:</strong> {car.model}
          </p>
          <p>
            <strong>Make:</strong> {car.make}
          </p>
          <p>
            <strong>Price:</strong> {car.price} QAR
          </p>
          <p>
            <strong>Kilometers:</strong> {car.kilometrage} {car.kmUnit}
          </p>
          <p>
            <strong>Transmission:</strong> {car.transmission}
          </p>
          <p>
            <strong>Body Type:</strong> {car.bodyType}
          </p>
          <p>
            <strong>Seats:</strong> {car.seats}
          </p>
          <p>
            <strong>Engine Size:</strong> {car.engineSize}
          </p>
          <p>
            <strong>Drive Type:</strong> {car.driveType}
          </p>
          <p>
            <strong>Interior Color:</strong> {car.interiorColor}
          </p>

          {car.preownedUrl && (
            <Link
              href={car.preownedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 mt-4 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              View on Preowned Website
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18.364 5.636l-10.728 10.728M15.536 4H20v4.464M5 19h4.464"
                />
              </svg>
            </Link>
          )}
        </div>
      </div>

      {/* Fullscreen modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          onClick={() => setIsModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(false);
            }}
            className="absolute top-6 right-6 text-white text-3xl font-bold"
            aria-label="Close modal"
          >
            &times;
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-6 text-white text-4xl font-bold select-none"
            aria-label="Previous image"
          >
            ‹
          </button>

          <img
            src={`${IMAGE_BASE}${currentImage}.webp`}
            alt={`Car image ${currentImageIndex + 1}`}
            className="max-w-full max-h-full mx-auto rounded-lg"
            onClick={(e) => e.stopPropagation()} // prevent modal close on image click
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-6 text-white text-4xl font-bold select-none"
            aria-label="Next image"
          >
            ›
          </button>
        </div>
      )}
    </main>
  );
}
