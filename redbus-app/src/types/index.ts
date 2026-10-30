export interface BusItem {
  id: string;
  operator: string;
  busType: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  origin: string;
  destination: string;
  fare: number;
  originalFare?: number;
  rating: number;
  ratingsCount: number;
  seatsAvailable: number;
  isPrimo?: boolean;
  hasLiveTracking?: boolean;
  amenities: string[];
  boardingPoints: string[];
  droppingPoints: string[];
  distanceKm?: number;
  // Vikalp Feature Fields (Team Vantage - < 250 km Short Corridors)
  isVikalpEligible?: boolean;
  vikalpFare?: number;
  vikalpEstimatedSpareSeats?: number;
  vikalpValidityHours?: number;
  vikalpNextDeparture?: string;
  vikalpSavingsPercent?: number;
  arrivingIn?: string;
}

export interface Seat {
  id: string;
  number: string;
  deck: 'lower' | 'upper';
  type: 'seater' | 'sleeper';
  row: number;
  col: number;
  fare: number;
  status: 'available' | 'booked' | 'ladies' | 'selected';
}

export interface OfferItem {
  id: string;
  code: string;
  title: string;
  description: string;
  discount: string;
  validTill: string;
  badge?: string;
}

export interface BookingRecord {
  id: string;
  pnr: string;
  operator: string;
  busType: string;
  from: string;
  to: string;
  date: string;
  time: string;
  seatNumbers: string[];
  fare: number;
  status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
  ticketType?: 'CONFIRMED' | 'VIKALP';
  vikalpExpiresAt?: string;
}
