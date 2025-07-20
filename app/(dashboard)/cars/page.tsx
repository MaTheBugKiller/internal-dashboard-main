'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

interface Car {
  vehicleNo: string;
  vin: string;
  make: string;
  model: string;
  description: string;
  year: number; // Changed to number for sorting and filtering
  price: number; // Changed to number for sorting
  kilometrage: number; // Changed to number for sorting
  kmUnit: string;
  transmission: string;
  fuelType: string;
  images: string[];
}

// Fetch all cars once (client component)
async function fetchCars(): Promise<Car[]> {
  const res = await fetch(
    'https://web-backenddev-cont-001-ajath8a5beh9eycz.westeurope-01.azurewebsites.net/api/v1/cpov/inventory-list?perPage=1000',
    { next: { revalidate: 30 } }
  );

  if (!res.ok) throw new Error('Failed to fetch cars');

  const data = await res.json();

  // Convert some string fields to numbers for sorting/filtering
  return data.data.map((car: any) => ({
    ...car,
    year: Number(car.year),
    price: Number(car.price),
    kilometrage: Number(car.kilometrage)
  }));
}

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20];

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter state
  const [makeFilter, setMakeFilter] = useState('');
  const [modelFilter, setModelFilter] = useState('');
  const [yearMinFilter, setYearMinFilter] = useState<number | ''>('');
  const [yearMaxFilter, setYearMaxFilter] = useState<number | ''>('');
  const [transmissionFilter, setTransmissionFilter] = useState('');
  const [fuelTypeFilter, setFuelTypeFilter] = useState('');

  // Sort state
  const [sortBy, setSortBy] = useState('');

  // Fetch cars once on mount
  useEffect(() => {
    fetchCars()
      .then(setCars)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  // Get unique makes and transmissions and fuel types for filters dropdowns
  const makes = useMemo(
    () => Array.from(new Set(cars.map((c) => c.make))).sort(),
    [cars]
  );
  const transmissions = useMemo(
    () => Array.from(new Set(cars.map((c) => c.transmission))).sort(),
    [cars]
  );
  const fuelTypes = useMemo(
    () =>
      Array.from(new Set(cars.map((c) => c.fuelType).filter(Boolean))).sort(),
    [cars]
  );

  // Filter cars based on filters
  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      if (
        makeFilter &&
        !car.make.toLowerCase().includes(makeFilter.toLowerCase())
      )
        return false;
      if (
        modelFilter &&
        !car.model.toLowerCase().includes(modelFilter.toLowerCase())
      )
        return false;
      if (yearMinFilter !== '' && car.year < yearMinFilter) return false;
      if (yearMaxFilter !== '' && car.year > yearMaxFilter) return false;
      if (transmissionFilter && car.transmission !== transmissionFilter)
        return false;
      if (fuelTypeFilter && car.fuelType !== fuelTypeFilter) return false;
      return true;
    });
  }, [
    cars,
    makeFilter,
    modelFilter,
    yearMinFilter,
    yearMaxFilter,
    transmissionFilter,
    fuelTypeFilter
  ]);

  // Sort filtered cars
  const sortedCars = useMemo(() => {
    if (!sortBy) return filteredCars;
    const sorted = [...filteredCars];
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'year-asc':
        sorted.sort((a, b) => a.year - b.year);
        break;
      case 'year-desc':
        sorted.sort((a, b) => b.year - a.year);
        break;
      case 'km-asc':
        sorted.sort((a, b) => a.kilometrage - b.kilometrage);
        break;
      case 'km-desc':
        sorted.sort((a, b) => b.kilometrage - a.kilometrage);
        break;
    }
    return sorted;
  }, [filteredCars, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(sortedCars.length / itemsPerPage);
  const paginatedCars = sortedCars.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page change
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (loading) return <p className="text-center mt-10">Loading cars...</p>;
  if (error)
    return (
      <p className="text-center mt-10 text-red-600">Failed to load cars.</p>
    );

  return (
    <div className="p-6">
      {/* Filters and Sort */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Filter by Make"
          value={makeFilter}
          onChange={(e) => {
            setMakeFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded px-3 py-1 w-40"
        />
        <input
          type="text"
          placeholder="Filter by Model"
          value={modelFilter}
          onChange={(e) => {
            setModelFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded px-3 py-1 w-40"
        />
        <input
          type="number"
          placeholder="Year Min"
          value={yearMinFilter}
          onChange={(e) => {
            setYearMinFilter(
              e.target.value === '' ? '' : Number(e.target.value)
            );
            setCurrentPage(1);
          }}
          className="border rounded px-3 py-1 w-24"
          min={1900}
          max={new Date().getFullYear()}
        />
        <input
          type="number"
          placeholder="Year Max"
          value={yearMaxFilter}
          onChange={(e) => {
            setYearMaxFilter(
              e.target.value === '' ? '' : Number(e.target.value)
            );
            setCurrentPage(1);
          }}
          className="border rounded px-3 py-1 w-24"
          min={1900}
          max={new Date().getFullYear()}
        />
        <select
          value={transmissionFilter}
          onChange={(e) => {
            setTransmissionFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded px-3 py-1 w-40"
        >
          <option value="">All Transmissions</option>
          {transmissions.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          value={fuelTypeFilter}
          onChange={(e) => {
            setFuelTypeFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded px-3 py-1 w-40"
        >
          <option value="">All Fuel Types</option>
          {fuelTypes.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded px-3 py-1 w-40"
        >
          <option value="">Sort By</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="year-asc">Year: Oldest to Newest</option>
          <option value="year-desc">Year: Newest to Oldest</option>
          <option value="km-asc">Mileage: Low to High</option>
          <option value="km-desc">Mileage: High to Low</option>
        </select>

        {/* Items per page */}
        <select
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="border rounded px-3 py-1 w-32"
        >
          {ITEMS_PER_PAGE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              Show {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Cars grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {paginatedCars.length === 0 && (
          <p className="col-span-full text-center text-gray-600">
            No cars found.
          </p>
        )}
        {paginatedCars.map((car) => (
          <Link
            key={car.vin}
            href={`/cars/${car.vehicleNo}`}
            className="block border rounded-xl shadow p-4 hover:shadow-lg transition"
          >
            {car.images && car.images.length > 0 ? (
              <img
                src={`https://platform.seez.co/image/500x0/${car.images[0]}.webp`}
                alt={`${car.make} ${car.model}`}
                className="w-full h-40 object-cover rounded mb-2"
              />
            ) : (
              <div className="w-full h-40 bg-gray-200 rounded mb-2 flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
            <h2 className="text-lg font-semibold">
              {car.make} {car.model}
            </h2>
            <p className="text-sm text-gray-600">{car.description}</p>
            <p className="text-sm">Year: {car.year}</p>
            <p className="text-sm font-medium">
              Price: {car.price.toLocaleString()} QAR
            </p>
          </Link>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-3 mt-6">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? 'bg-blue-600 text-white' : ''
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
