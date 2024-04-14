export interface Location {
  id: number;
  name: string;
  type: string;
  residents: string[];
  url: string;
  created: string;
}

export interface LocationState {
  locations: Location[];
}
