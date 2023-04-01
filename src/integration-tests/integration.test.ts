const request = require('supertest');
const appUrl = 'http://localhost:8080';

async function uploadFile() {
    const response = await request(appUrl)
        .post('/files')
        .attach('file', __filename);

    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
    expect(response.body).toHaveProperty('privateKey');
    expect(typeof response.body.privateKey).toBe('string');
    expect(response.body).toHaveProperty('publicKey');
    expect(typeof response.body.publicKey).toBe('string');

    return {
        publicKey: response.body.publicKey,
        privateKey: response.body.privateKey
    }
}

describe('POST /file', () => {
    it('returns a JSON object with a private key string and a public key string', async () => {
        await uploadFile();
    });
});

describe('GET /file/:publicKey', () => {
    it('must return 200 for a file that exists', async () => {
        const { publicKey } = await uploadFile();

        const response = await request(appUrl)
            .get(`/files/${publicKey}`)

        expect(response.status).toBe(200);
    });

    it('must return 404 for a file that does not exist', async () => {
        const response = await request(appUrl)
            .get(`/files/doesnotexist`)

        expect(response.status).toBe(404);
    });
});

describe('DELETE /file/:privateKey', () => {
    it('must return 200 for a file that exists', async () => {
        const { privateKey } = await uploadFile();

        const response = await request(appUrl)
            .delete(`/files/${privateKey}`)

        expect(response.status).toBe(200);
    });

    it('must return 400 for an invalid private key', async () => {
        const response = await request(appUrl)
            .delete(`/files/doesnotexist`)

        expect(response.status).toBe(400);
    });

    it('must return 404 for a file that doesnt exist, with a valid private key', async () => {
        const validPrivateKey = "MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAMQc2NGrcvwDcHaEx-9Ci1qvhVotpqDAGdo0uFR7OmG5q9E-iP4pU2q3fHzVxyQ49H4GWApy1d1UcE99OZYjtDUDq99CgdmeiZFKoZrIAO7W-s-XP2HPXbknspSyuc4vkwS2BSfX-xi4GUNl7lfwCEB8MPqYNlnf2kyDOqqmK6tnAgMBAAECgYEAkcuoXWgK2dRsvY_FW9iq5UZr6zjZEdT-4zwidZwPMSvp0mudSObMPyAeCmib3hABo9dviIUK_bqSrGW6dCYjB57zXlsSCVugRs5x4391QlwVm6Dhb3V4izvF29BqDso3czUVF1zukqnDRERA7F56Qrf-v-Ckw0-a1AsgxFIigbECQQD9rF0rn3MnYCQUZ7HTAbxVtpujqqYMl1TGPuTcLD_QkUiFME5eFEbgkm9uQ7m4A37deE0ROia9t_eq5CY_wqMNAkEAxelUAcKRRM5474VMijm7LDhyAJBkQD9lGqZUeZLTO4dKvLMHzvgWY0KITtxPWCvtFQ0QBF7SvGuu7M3wl4M7QwJAcgPWnJS-HSSJEuLIeh59l8jLi3RXzbD22WPLWWpKBGRIRBTCJGbYtHccvmKSRrLLgp9fhC6u2vakyppg1qeUwQJBAMWY7YgIU_QH1dUHGOFVPJytCp2njIBdCzvtX6A2SPJBZQw8D4rERc36yo86BXo5-S6waRKD_hGjzfWetB0CKHMCQFJJdeolFmstGIj8wqSEXutmaX4M_BnPfXPps8ZnqpYXRpFkTjyE0EsOkqxpvev_NnofVb_oo2J8H2NcP3uu6lA"
        const response = await request(appUrl)
            .delete(`/files/${validPrivateKey}`)

        expect(response.status).toBe(404);
    });
});