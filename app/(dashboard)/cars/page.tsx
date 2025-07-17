// app/(dashboard)/cars/page.tsx
import Link from 'next/link';

interface Car {
  vehicleNo: string;
  vin: string;
  make: string;
  model: string;
  description: string;
  year: string;
  price: string;
  images: string[];
}

async function fetchCars(): Promise<Car[]> {
  const res = await fetch(
    'https://web-backenddev-cont-001-ajath8a5beh9eycz.westeurope-01.azurewebsites.net/api/v1/cpov/inventory-list?perPage=1000',
    {
      next: { revalidate: 30 }
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch cars');
  }

  const data = await res.json();
  return data.data;
}

export default async function CarsPage() {
  const cars = await fetchCars();

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {cars.map((car) => (
        <Link
          key={car.vin}
          href={`/cars/${car.vehicleNo}`}
          className="block border rounded-xl shadow p-4 hover:shadow-lg transition"
        >
          {car.images && car.images.length > 0 ? (
            <img
              src={`https://preowned.aamotors.com/${car.images[0]}`}
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
          <p className="text-sm font-medium">Price: {car.price} QAR</p>
        </Link>
      ))}
    </div>
  );
}
