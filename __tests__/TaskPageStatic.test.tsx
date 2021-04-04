import '@testing-library/jest-dom/extend-expect'
import { render, screen, cleanup } from '@testing-library/react'
import { getPage, initTestHelpers } from 'next-page-tester'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

initTestHelpers()

const server = setupServer(
  rest.get('https://jsonplaceholder.typicode.com/todos/', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          userId: 3,
          id: 3,
          title: 'Static task C',
          completed: true,
        },
        {
          userId: 4,
          id: 4,
          title: 'Static task D',
          completed: false,
        },
      ])
    )
  })
)

beforeAll(() => {
  // モックのAPIサーバーを起動
  server.listen()
})
afterEach(() => {
  // 各itが終わるタイミングでサーバーのリセットとクリーンナップを実行する(テスト間の副作用を防ぐ)
  server.resetHandlers()
  cleanup()
})
afterAll(() => {
  // すべてのテストケースが終了したらcloseする
  server.close()
})

describe('Todo page /getStaticProps', () => {
  it('should render the list of tasks pre-fetch by getStaticProps', async () => {
    const { page } = await getPage({
      route: '/task-page',
    })
    render(page)
    expect(await screen.findByText('todos page')).toBeInTheDocument()
    expect(screen.getByText('Static task C')).toBeInTheDocument()
    expect(screen.getByText('Static task D')).toBeInTheDocument()
  })
})
