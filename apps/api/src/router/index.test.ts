import { describe, expect, test } from 'vite-plus/test'

import { appRouter } from './index'

describe('user input validation', () => {
  const caller = appRouter.createCaller({})

  test('creates and retrieves a user with an empty bio', async () => {
    const user = await caller.createUser({ name: 'Ada', bio: '' })

    expect(user).toMatchObject({ id: expect.any(String), name: 'Ada' })
    expect(await caller.getUserById(user.id)).toEqual(user)
  })

  test('accepts a bio at the maximum length', async () => {
    const bio = 'a'.repeat(142)

    expect(await caller.createUser({ name: 'Ada', bio })).toMatchObject({ name: 'Ada', bio })
  })

  test('rejects names shorter than three characters', async () => {
    await expect(caller.createUser({ name: 'Al', bio: '' })).rejects.toMatchObject({
      code: 'BAD_REQUEST',
    })
  })

  test('rejects a bio longer than the maximum', async () => {
    await expect(caller.createUser({ name: 'Ada', bio: 'a'.repeat(143) })).rejects.toMatchObject({
      code: 'BAD_REQUEST',
    })
  })
})
