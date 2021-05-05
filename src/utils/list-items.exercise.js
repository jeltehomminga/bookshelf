import {useMutation, useQuery, useQueryCache} from 'react-query'
import {client} from './api-client.final'

const useListItems = ({token}) => {
  const {data: listItems = []} = useQuery({
    queryKey: 'list-items',
    queryFn: () => client('list-items', {token}).then(data => data.listItems),
  })

  return listItems
}

const useListItem = ({bookId, token}) =>
  useListItems({token}).find(item => item.bookId === bookId) ?? null

const useUpdateList = ({token, options}) => {
  const queryCache = useQueryCache()
  const [mutate, extras] = useMutation(
    ({id, ...updates}) =>
      client(`list-items/${id}`, {
        data: updates,
        token: token,
        method: 'PUT',
      }),
    {onSettled: () => queryCache.invalidateQueries('list-items'), ...options},
  )

  return {update: mutate, ...extras}
}

const useRemoveListItem = ({token, options}) => {
  const queryCache = useQueryCache()
  const [remove] = useMutation(
    ({id}) =>
      client(`list-items/${id}`, {
        token,
        method: 'DELETE',
      }),
    {onSettled: () => queryCache.invalidateQueries('list-items'), ...options},
  )

  return remove
}

const useCreateListItem = ({token, options}) => {
  const queryCache = useQueryCache()
  const [create] = useMutation(
    ({bookId}) => client('list-items', {data: {bookId}, token}),
    {onSettled: () => queryCache.invalidateQueries('list-items'), ...options},
  )
  return create
}

export {
  useListItems,
  useListItem,
  useUpdateList,
  useRemoveListItem,
  useCreateListItem,
}
