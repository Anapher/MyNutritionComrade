import axios from 'axios';

export async function requestPassword(emailAddress: string): Promise<void> {
   await axios.post('/api/v1/authentication/request_password', { emailAddress });
}
