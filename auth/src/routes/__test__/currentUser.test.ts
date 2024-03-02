import request from "supertest";
import { app } from "../../app";

it("responds with details about the current user", async () => {
  const authResponse = await request(app)
    .post("/api/users/signup")
    .send({
      "email": "test@example.com",
      "password": "password"
    })
    .expect(201);

  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", authResponse.get("Set-Cookie"))
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual("test@example.com");
});
