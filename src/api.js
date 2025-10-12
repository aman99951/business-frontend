const API_BASE = import.meta.env.VITE_API_BASE || 'https://business-backend-tl5s.vercel.app/api';
export async function login(username, password) {
const res = await fetch(`${API_BASE}/auth/login/`, {
method: 'POST', headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ username, password })
});
if (!res.ok) throw new Error('Login failed');
return res.json(); // {token}
}
function authHeaders() {
const token = localStorage.getItem('token');
return token ? { Authorization: `Token ${token}` } : {};
}
export async function getSummary() {
const r = await fetch(`${API_BASE}/summary/`, { headers: authHeaders() });
return r.json();
}
export async function listCategories() {
const r = await fetch(`${API_BASE}/categories/`, { headers: authHeaders() });
return r.json();
}
export async function createCategory(data){
const r = await fetch(`${API_BASE}/categories/`, { method:'POST', headers: { 'Content-Type':'application/json', ...authHeaders() }, body: JSON.stringify(data)});
return r.json();
}
export async function listTransactions(params={}){
const qs = new URLSearchParams(params).toString();
const r = await fetch(`${API_BASE}/transactions/${qs?`?${qs}`:''}`, { headers: authHeaders() });
return r.json();
}
export async function createTransaction(data){
const r = await fetch(`${API_BASE}/transactions/`, { method:'POST', headers:{ 'Content-Type':'application/json', ...authHeaders() }, body: JSON.stringify(data)});
return r.json();
}
export async function updateTransaction(id, data){
const r = await fetch(`${API_BASE}/transactions/${id}/`, { method:'PUT', headers:{ 'Content-Type':'application/json', ...authHeaders() }, body: JSON.stringify(data)});
return r.json();
}
export async function deleteTransaction(id){
return fetch(`${API_BASE}/transactions/${id}/`, { method:'DELETE', headers: authHeaders() });
}
export async function listBudgets(){
const r = await fetch(`${API_BASE}/budgets/`, { headers: authHeaders() });
return r.json();
}
export async function createBudget(data){
const r = await fetch(`${API_BASE}/budgets/`, { method:'POST', headers:{ 'Content-Type':'application/json', ...authHeaders() }, body: JSON.stringify(data)});
return r.json();
}
export async function currentBudget(){
const r = await fetch(`${API_BASE}/budgets/current/`, { headers: authHeaders() });
return r.json();
}