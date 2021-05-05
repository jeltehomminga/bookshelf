import React from 'react'
import {useQuery, useQueryCache} from 'react-query'
import bookPlaceholderSvg from '../assets/book-placeholder.svg'
import {client} from './api-client.final'

const loadingBook = {
  title: 'Loading...',
  author: 'loading...',
  coverImageUrl: bookPlaceholderSvg,
  publisher: 'Loading Publishing',
  synopsis: 'Loading...',
  loadingBook: true,
}

const loadingBooks = Array.from({length: 10}, (v, index) => ({
  id: `loading-book-${index}`,
  ...loadingBook,
}))

export const useBookSearch = ({bookId, token}) => {
  const {data: book = loadingBook} = useQuery({
    queryKey: ['book', {bookId}],
    queryFn: () => client(`books/${bookId}`, {token}).then(data => data.book),
  })

  return book
}

export const useBooksSearch = ({query, token}) => {
  const result = useQuery({
    queryKey: ['bookSearch', {query}],
    queryFn: () =>
      client(`books?query=${encodeURIComponent(query)}`, {
        token,
      }).then(data => data.books),
  })

  return {...result, books: result.data ?? loadingBooks}
}

export const useRefetchBookSearchQuery = token => {
  const queryCache = useQueryCache()

  React.useEffect(() => {
    return () => {
      queryCache.removeQueries('bookSearch')
      queryCache.prefetchQuery({
        queryKey: ['bookSearch', {query: ''}],
        queryFn: () =>
          client(`books?query=${encodeURIComponent('')}`, {
            token,
          }).then(data => data.books),
      })
    }
  }, [queryCache, token])
}
