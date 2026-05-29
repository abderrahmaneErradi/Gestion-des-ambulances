const BASE_URL = "http://127.0.0.1:8000/api";

/* ======================
   TOKEN
====================== */
const getToken = () => localStorage.getItem("auth_token");

/* ======================
   HEADERS
====================== */
const headers = (isAuth = true) => {
  return {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...(isAuth && getToken()
      ? { Authorization: `Bearer ${getToken()}` }
      : {}),
  };
};

/* ======================
   HANDLE RESPONSE
====================== */
const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `HTTP Error ${res.status}`);
  }

  return data;
};

/* ======================
   AUTH
====================== */
export const authLogin = (email, password) => {
  return fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: headers(false), // مهم: بلا token
    body: JSON.stringify({ email, password }),
  }).then(handleResponse);
};

export const authLogout = () => {
  return fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
    headers: headers(true),
  }).then(handleResponse);
};

/* ======================
   DASHBOARD
====================== */
export const getStats = () => {
  return fetch(`${BASE_URL}/dashboard/stats`, {
    method: "GET",
    headers: headers(true),
  }).then(handleResponse);
};

/* ======================
   FLOTTE
====================== */
export const getAmbulances = () =>
  fetch(`${BASE_URL}/flotte/ambulances`, {
    method: "GET",
    headers: headers(true),
  }).then(handleResponse);

export const createAmbulance = (data) =>
  fetch(`${BASE_URL}/flotte/ambulances`, {
    method: "POST",
    headers: headers(true),
    body: JSON.stringify(data),
  }).then(handleResponse);

export const updateAmbulance = (id, data) =>
  fetch(`${BASE_URL}/flotte/ambulances/${id}`, {
    method: "PUT",
    headers: headers(true),
    body: JSON.stringify(data),
  }).then(handleResponse);

export const deleteAmbulance = (id) =>
  fetch(`${BASE_URL}/flotte/ambulances/${id}`, {
    method: "DELETE",
    headers: headers(true),
  }).then(handleResponse);

export const getAmbulanciers = () =>
  fetch(`${BASE_URL}/flotte/ambulanciers`, {
    method: "GET",
    headers: headers(true),
  }).then(handleResponse);

export const assignAmbulanceToDriver = (driverId, ambulanceId) =>
  fetch(`${BASE_URL}/flotte/ambulanciers/${driverId}/assign`, {
    method: "POST",
    headers: headers(true),
    body: JSON.stringify({ ambulance_id: ambulanceId }),
  }).then(handleResponse);

export const updateDriverStatus = (driverId, statut) =>
  fetch(`${BASE_URL}/flotte/ambulanciers/${driverId}/status`, {
    method: "POST",
    headers: headers(true),
    body: JSON.stringify({ statut }),
  }).then(handleResponse);

/* ======================
   INTERVENTIONS
====================== */
export const getInterventions = (filters = {}) => {
  const params = new URLSearchParams(filters).toString();

  return fetch(
    `${BASE_URL}/interventions${params ? "?" + params : ""}`,
    {
      method: "GET",
      headers: headers(true),
    }
  ).then(handleResponse);
};

export const assignManually = (id, ambulanceId) =>
  fetch(`${BASE_URL}/interventions/${id}/assign-manual`, {
    method: "POST",
    headers: headers(true),
    body: JSON.stringify({ ambulance_id: ambulanceId }),
  }).then(handleResponse);

export const assignAuto = (id) =>
  fetch(`${BASE_URL}/interventions/${id}/assign-auto`, {
    method: "POST",
    headers: headers(true),
  }).then(handleResponse);

export const cancelIntervention = (id) =>
  fetch(`${BASE_URL}/interventions/${id}/cancel`, {
    method: "POST",
    headers: headers(true),
  }).then(handleResponse);

export const updateStatus = (id, statut) =>
  fetch(`${BASE_URL}/interventions/${id}/status`, {
    method: "POST",
    headers: headers(true),
    body: JSON.stringify({ statut }),
  }).then(handleResponse);