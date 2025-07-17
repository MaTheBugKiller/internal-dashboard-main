// app/(dashboard)/cars/[vehicleNo]/page.tsx
import React from 'react';

interface CarDetailProps {
  params: { vehicleNo: string };
}

async function fetchCarDetails(vehicleNo: string) {
  const res = await fetch(
    `https://web-backenddev-cont-001-ajath8a5beh9eycz.westeurope-01.azurewebsites.net/api/v1/cpov/vehicle/${vehicleNo}`,
    {
      next: { revalidate: 2592000 } // cache for 30 days (adjust as needed)
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch car details');
  }

  const data = await res.json();
  return data.data;
}

export default async function CarDetailsPage({ params }: CarDetailProps) {
  const car = await fetchCarDetails(params.vehicleNo);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">
        {car.make} {car.model} ({car.year})
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Images */}
        <div>
          {car.images && car.images.length > 0 ? (
            car.images.map((img: string, index: number) => (
              <img
                key={index}
                src={`https://preowned.aamotors.com/${img}`}
                alt={`${car.model} image ${index + 1}`}
                className="mb-2 rounded-lg w-full object-cover"
              />
            ))
          ) : (
            <p>No images available</p>
          )}
        </div>

        {/* Specifications */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Specifications</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>Description:</strong> {car.description}
            </li>
            <li>
              <strong>VIN:</strong> {car.vin}
            </li>
            <li>
              <strong>License Plate:</strong> {car.licensePlate}
            </li>
            <li>
              <strong>Kilometrage:</strong> {car.kilometrage} {car.kmUnit}
            </li>
            <li>
              <strong>Transmission:</strong> {car.transmission}
            </li>
            <li>
              <strong>Fuel Type:</strong> {car.fuelType || 'N/A'}
            </li>
            <li>
              <strong>Drive Type:</strong> {car.driveType}
            </li>
            <li>
              <strong>Body Type:</strong> {car.bodyType}
            </li>
            <li>
              <strong>Price:</strong> {car.price} QAR
            </li>
            <li>
              <strong>Doors:</strong> {car.doors}
            </li>
            <li>
              <strong>Engine Size:</strong> {car.engineSize}
            </li>
            <li>
              <strong>Seats:</strong> {car.seats}
            </li>
            <li>
              <strong>Weight:</strong> {car.weight} {car.weightUnit}
            </li>
            <li>
              <strong>Power:</strong> {car.power}
            </li>
            <li>
              <strong>Interior Color:</strong> {car.interiorColor}
            </li>
          </ul>
          <a
            href={car.preownedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline mt-4 inline-block"
          >
            View on Preowned Site
          </a>
        </div>
      </div>
    </div>
  );
}
