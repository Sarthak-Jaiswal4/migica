import { jwtVerify } from 'jose';
import jwt from 'jsonwebtoken';

async function test() {
  const secretString = "test_secret_123456";
  
  // Create token with jsonwebtoken
  const token = jwt.sign({ userId: "123", isAdmin: true }, secretString, {
    expiresIn: "7d",
  });
  
  console.log("Token:", token);
  
  // Verify with jose
  try {
    const secretBuffer = new TextEncoder().encode(secretString);
    const { payload } = await jwtVerify(token, secretBuffer);
    console.log("Verified:", payload);
  } catch (err) {
    console.error("Jose Error:", err);
  }
}

test();
