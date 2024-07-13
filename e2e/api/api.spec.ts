import { test, expect } from '@playwright/test';

var domain = "http://localhost:8090"

test.describe("Get Skill", () => {
  test('should respond all skill items from /api/v1/skills', async ({ request }) => {
    const addSkill1 = await request.post(domain + "/api/v1/skills",
      {
        data: {
          Key: "gobasic",
          Name: "Go Basic",
          Description: "Go...",
          Logo: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
          Tags: ["programming language"]
        }        
      }
    )
    const addSkill2 = await request.post(domain + "/api/v1/skills",
      {
        data: {
          Key: "react",
          Name: "React",
          Description: "Go...",
          Logo: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
          Tags: ["javascript", "frontend"]
        }        
      }
    )
    const resp = await request.get(domain + "/api/v1/skills")

    expect(resp.ok()).toBeTruthy()
    expect(await resp.json()).toEqual(
      expect.arrayContaining([
        {
          Key: "gobasic",
          Name: "Go Basic",
          Description: "Go...",
          Logo: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
          Tags: ["programming language"]
        },
        {
          Key: "react",
          Name: "React",
          Description: "Go...",
          Logo: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
          Tags: ["javascript", "frontend"]
        }
      ]
      )
    )

    const keySkill1 = await addSkill1.json()
    const keySkill2 = await addSkill2.json()

    await request.delete(domain + "/api/v1/skills/" + String(keySkill1.data.Key))
    await request.delete(domain + "/api/v1/skills/" + String(keySkill2.data.Key))
  });
})
