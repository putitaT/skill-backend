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

  test('should respond one skill when get by key from /api/v1/skills/:key', async ({ request }) => {
    const addSkill = await request.post(domain + "/api/v1/skills",
      {
        data: {
          Key: "tailwind3",
          Name: "Tailwind CSS",
          Description: "css...",
          Logo: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
          Tags: ["CSS"]
        }
      }
    )
    const keySkill = await addSkill.json()
    const resp = await request.get(domain + "/api/v1/skills/" + String(keySkill.data.Key))
    expect(resp.ok()).toBeTruthy()
    expect(await resp.json()).toEqual(
      expect.objectContaining({
        data: {
          Key: "tailwind3",
          Name: "Tailwind CSS",
          Description: "css...",
          Logo: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
          Tags: ["CSS"]
        },
        status: "success"
      })
    )
    await request.delete(domain + "/api/v1/skills/" + String(keySkill.data.Key))
  });

  test('should respond error when get by key that not found from /api/v1/skills/:key', async ({ request }) => {
    const resp = await request.get(domain + "/api/v1/skills/" + "typescripttt")
    expect(resp.status()).toBe(404);
    expect(await resp.json()).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        status: "error"
      })
    )
  });
})

test.describe("Update Skill", () => {
  test('should respond skill that update when update by key from request PUT /api/v1/skills/:key', async ({ request }) => {
    const addSkill = await request.post(domain + "/api/v1/skills",
      {
        data: {
          Key: "typescript",
          Name: "Typescript",
          Description: "TypeScript...",
          Logo: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
          Tags: ["programming language", "scripting"]
        }
      }
    )
    const keySkill = await addSkill.json()
    const resp = await request.put(domain + "/api/v1/skills/" + String(keySkill.data.Key),
      {
        data: {
          Key: "typescript",
          Name: "Typescript (TS)",
          Description: "TypeScript is a statically typed language that compiles down to plain JavaScript.",
          Logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/1200px-Typescript_logo_2020.svg.png",
          Tags: ["programming language", "scripting", "functional"]
        }
      }
    )
    expect(resp.ok()).toBeTruthy()
    const updateResp = await resp.json()
    expect(await resp.json()).toEqual(
      expect.objectContaining({
        data: {
          Key: "typescript",
          Name: "Typescript (TS)",
          Description: "TypeScript is a statically typed language that compiles down to plain JavaScript.",
          Logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/1200px-Typescript_logo_2020.svg.png",
          Tags: ["programming language", "scripting", "functional"]
        },
        status: "success"
      })
    )

    const getByKey = await request.get(domain + "/api/v1/skills/" + String(updateResp.data.Key))
    const getByKeyResp = await getByKey.json()
    expect(getByKey.ok()).toBeTruthy()
    expect(await getByKey.json()).toEqual(
      expect.objectContaining({
        data: {
          Key: "typescript",
          Name: "Typescript (TS)",
          Description: "TypeScript is a statically typed language that compiles down to plain JavaScript.",
          Logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/1200px-Typescript_logo_2020.svg.png",
          Tags: ["programming language", "scripting", "functional"]
        },
        status: "success"
      })
    )
    await request.delete(domain + "/api/v1/skills/" + String(getByKeyResp.data.Key))
  });

  test('should respond error when update by key that not found from request PUT /api/v1/skills/:key', async ({ request }) => {
    const resp = await request.put(domain + "/api/v1/skills/" + "typescripttt",
      {
        data: {
          Key: "typescript",
          Name: "Typescript (TS)",
          Description: "TypeScript is a statically typed language that compiles down to plain JavaScript.",
          Logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/1200px-Typescript_logo_2020.svg.png",
          Tags: ["programming language", "scripting", "functional"]
        }
      }
    )
    expect(resp.status()).toBe(404);
    // expect(resp.ok()).toBeFalsy()
    expect(await resp.json()).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        status: "error"
      })
    )
  });
  
  test('should respond skill that update when update Name from request PATCH /api/v1/skills/:key', async ({ request }) => {
    const addSkill = await request.post(domain + "/api/v1/skills",
      {
        data: {
          Key: "typescript",
          Name: "Typescript",
          Description: "TypeScript...",
          Logo: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
          Tags: ["programming language", "scripting"]
        }
      }
    )
    const keySkill = await addSkill.json()
    const resp = await request.patch(domain + "/api/v1/skills/" + String(keySkill.data.Key + "/actions/name"),
      {
        data: {
          Name: "Typescript (TS)"
        }
      }
    )
    expect(resp.ok()).toBeTruthy()
    const updateResp = await resp.json()
    expect(await resp.json()).toEqual(
      expect.objectContaining({
        data: {
          Key: "typescript",
          Name: "Typescript (TS)",
          Description: "TypeScript...",
          Logo: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
          Tags: ["programming language", "scripting"]
        },
        status: "success"
      })
    )

    const getByKey = await request.get(domain + "/api/v1/skills/" + String(updateResp.data.Key))
    const getByKeyResp = await getByKey.json()
    expect(getByKey.ok()).toBeTruthy()
    expect(await getByKey.json()).toEqual(
      expect.objectContaining({
        data: {
          Key: "typescript",
          Name: "Typescript (TS)",
          Description: "TypeScript...",
          Logo: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
          Tags: ["programming language", "scripting"]
        },
        status: "success"
      })
    )
    await request.delete(domain + "/api/v1/skills/" + String(getByKeyResp.data.Key))
  });

  test('should respond error when update Name that not found key from request PATCH /api/v1/skills/:key', async ({ request }) => {
    const resp = await request.patch(domain + "/api/v1/skills/" + "typescripttt" + "/actions/name",
      {
        data: {
          Name: "Typescript (TS)"
        }
      }
    )
    expect(resp.status()).toBe(404);
    expect(await resp.json()).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        status: "error"
      })
    )
  });

  test('should respond skill that update when update Description from request PATCH /api/v1/skills/:key', async ({ request }) => {
    const addSkill = await request.post(domain + "/api/v1/skills",
      {
        data: {
          Key: "typescript",
          Name: "Typescript",
          Description: "TypeScript...",
          Logo: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
          Tags: ["programming language", "scripting"]
        }
      }
    )
    const keySkill = await addSkill.json()
    const resp = await request.patch(domain + "/api/v1/skills/" + String(keySkill.data.Key + "/actions/description"),
      {
        data: {
          Description: "TypeScript is a statically typed language that compiles down to plain JavaScript."
        }
      }
    )
    expect(resp.ok()).toBeTruthy()
    const updateResp = await resp.json()
    expect(await resp.json()).toEqual(
      expect.objectContaining({
        data: {
          Key: "typescript",
          Name: "Typescript",
          Description: "TypeScript is a statically typed language that compiles down to plain JavaScript.",
          Logo: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
          Tags: ["programming language", "scripting"]
        },
        status: "success"
      })
    )

    const getByKey = await request.get(domain + "/api/v1/skills/" + String(updateResp.data.Key))
    const getByKeyResp = await getByKey.json()
    expect(getByKey.ok()).toBeTruthy()
    expect(await getByKey.json()).toEqual(
      expect.objectContaining({
        data: {
          Key: "typescript",
          Name: "Typescript",
          Description: "TypeScript is a statically typed language that compiles down to plain JavaScript.",
          Logo: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
          Tags: ["programming language", "scripting"]
        },
        status: "success"
      })
    )
    await request.delete(domain + "/api/v1/skills/" + String(getByKeyResp.data.Key))
  });

  test('should respond error when update Description that not found key from request PATCH /api/v1/skills/:key', async ({ request }) => {
    const resp = await request.patch(domain + "/api/v1/skills/" + "typescripttt" + "/actions/description",
      {
        data: {
          Description: "Typescript is a ..."
        }
      }
    )
    expect(resp.status()).toBe(404);
    expect(await resp.json()).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        status: "error"
      })
    )
  });

  test('should respond skill that update when update Logo from request PATCH /api/v1/skills/:key', async ({ request }) => {
    const addSkill = await request.post(domain + "/api/v1/skills",
      {
        data: {
          Key: "typescript",
          Name: "Typescript",
          Description: "TypeScript...",
          Logo: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
          Tags: ["programming language", "scripting"]
        }
      }
    )
    const keySkill = await addSkill.json()
    const resp = await request.patch(domain + "/api/v1/skills/" + String(keySkill.data.Key + "/actions/logo"),
      {
        data: {
          Logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/1200px-Typescript_logo_2020.svg.png"
        }
      }
    )
    expect(resp.ok()).toBeTruthy()
    const updateResp = await resp.json()
    expect(await resp.json()).toEqual(
      expect.objectContaining({
        data: {
          Key: "typescript",
          Name: "Typescript",
          Description: "TypeScript...",
          Logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/1200px-Typescript_logo_2020.svg.png",
          Tags: ["programming language", "scripting"]
        },
        status: "success"
      })
    )

    const getByKey = await request.get(domain + "/api/v1/skills/" + String(updateResp.data.Key))
    const getByKeyResp = await getByKey.json()
    expect(getByKey.ok()).toBeTruthy()
    expect(await getByKey.json()).toEqual(
      expect.objectContaining({
        data: {
          Key: "typescript",
          Name: "Typescript",
          Description: "TypeScript...",
          Logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/1200px-Typescript_logo_2020.svg.png",
          Tags: ["programming language", "scripting"]
        },
        status: "success"
      })
    )
    await request.delete(domain + "/api/v1/skills/" + String(getByKeyResp.data.Key))
  });

  test('should respond error when update Logo that not found key from request PATCH /api/v1/skills/:key', async ({ request }) => {
    const resp = await request.patch(domain + "/api/v1/skills/" + "typescripttt" + "/actions/logo",
      {
        data: {
          Logo: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg"
        }
      }
    )
    expect(resp.status()).toBe(404);
    expect(await resp.json()).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        status: "error"
      })
    )
  });

  test('should respond skill that update when update Tags from request PATCH /api/v1/skills/:key', async ({ request }) => {
    const addSkill = await request.post(domain + "/api/v1/skills",
      {
        data: {
          Key: "typescript",
          Name: "Typescript",
          Description: "TypeScript...",
          Logo: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
          Tags: ["programming language", "scripting"]
        }
      }
    )
    const keySkill = await addSkill.json()
    const resp = await request.patch(domain + "/api/v1/skills/" + String(keySkill.data.Key + "/actions/tags"),
      {
        data: {
          Tags: ["programming language", "scripting", "functional"]
        }
      }
    )
    expect(resp.ok()).toBeTruthy()
    const updateResp = await resp.json()
    expect(await resp.json()).toEqual(
      expect.objectContaining({
        data: {
          Key: "typescript",
          Name: "Typescript",
          Description: "TypeScript...",
          Logo: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
          Tags: ["programming language", "scripting", "functional"]
        },
        status: "success"
      })
    )

    const getByKey = await request.get(domain + "/api/v1/skills/" + String(updateResp.data.Key))
    const getByKeyResp = await getByKey.json()
    expect(getByKey.ok()).toBeTruthy()
    expect(await getByKey.json()).toEqual(
      expect.objectContaining({
        data: {
          Key: "typescript",
          Name: "Typescript",
          Description: "TypeScript...",
          Logo: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
          Tags: ["programming language", "scripting", "functional"]
        },
        status: "success"
      })
    )
    await request.delete(domain + "/api/v1/skills/" + String(getByKeyResp.data.Key))
  });

  test('should respond error when update Tags that not found key from request PATCH /api/v1/skills/:key', async ({ request }) => {
    const resp = await request.patch(domain + "/api/v1/skills/" + "typescripttt" + "/actions/tags",
      {
        data: {
          Tags: ["programming language", "scripting", "functional"]
        }
      }
    )
    expect(resp.status()).toBe(404);
    expect(await resp.json()).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        status: "error"
      })
    )
  });
})
