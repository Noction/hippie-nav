import { Document } from 'flexsearch'
import { ref } from 'vue'
import { useFlexSearch } from '@/composables/useFlexSearch'

function dummyIndex () {
  const flexIndex = new Document({
    document: {
      id: 'id',
      index: ['content']
    }
  })

  flexIndex.add({ content: 'some text', id: 0 })

  return flexIndex
}

describe('composables / useFlexSearch', () => {
  it('Should get 1 result one query change', () => {
    // Arrange
    const providedIndex = dummyIndex()
    const query = ref('')
    const { results } = useFlexSearch(query, providedIndex)

    // Act
    query.value = 'some'

    // Assert
    expect(results).toHaveLength(1)
  })
})
