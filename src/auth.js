import { login as apiLogin } from './api';
export async function login(username, password){
const { token } = await apiLogin(username, password);
localStorage.setItem('token', token);
}
export function logout(){ localStorage.removeItem('token'); }
export function isAuthed(){ return !!localStorage.getItem('token'); }