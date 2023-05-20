import { Document } from 'flexsearch'
import { IndexFields } from '@/types'
import { faker } from '@faker-js/faker'
import { indexSetup } from '@/util/indexSetup'
import { describe, expect } from 'vitest'

describe('util `indexSetup`', function () {
  describe('indexSetup', function () {
    it('should return instanceOf Document', function () {
      const indexFields: IndexFields = { id: 'id', index: faker.word.words().split(' ') }

      const index = indexSetup(indexFields)

      expect(index).toBeInstanceOf(Document)
    })
  })
})