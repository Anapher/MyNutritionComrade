import axios from 'axios';
import { LoginResponseDto } from './types';

export async function requestPassword(emailAddress: string): Promise<void> {
   await axios.post('/api/v1/authentication/request_password', { emailAddress });
}

export async function login(emailAddress: string, password: string): Promise<LoginResponseDto> {
   const response = await axios.post('/api/v1/authentication/login', { emailAddress, password });
   return response.data as any;
}
