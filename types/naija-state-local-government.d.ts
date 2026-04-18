declare module "naija-state-local-government" {
  function states(): string[];
  function lgAs(state: string): string[];
  function senatorialDistricts(state: string): string[];
  // Add other methods if necessary, but states() is the primary one used here.
}
