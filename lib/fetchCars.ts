

export async function fetchCars() {
  const res = await fetch(
    "https://web-backenddev-cont-001-ajath8a5beh9eycz.westeurope-01.azurewebsites.net/api/v1/cpov/inventory-list?perPage=1000",
    {
      cache: 'no-store', // or 'force-cache' depending on your needs
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch cars");
  }

  const data = await res.json();
  return data.data; // return the array of cars
}
