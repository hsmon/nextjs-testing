import '@testing-library/jest-dom/extend-expect'
import { render, screen, cleanup } from '@testing-library/react'
import { getPage, initTestHelpers } from 'next-page-tester'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

initTestHelpers()

const handler = [
  rest.get('https://jsonplaceholder.typicode.com/posts/', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          userId: 1,
          id: 1,
          title: 'dummy title 1',
          body: 'dummy body 1',
        },
        {
          userId: 2,
          id: 2,
          title: 'dummy title 2',
          body: 'dummy body 2',
        },
      ])
    )
  }),
]
const server = setupServer(...handler)

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

describe('blog page', () => {
  it('should render the ist of blogs pre-fetched by getStaticProps', async () => {
    const { page } = await getPage({
      route: '/blog-page',
    })
    render(page)
    expect(await screen.findByText('blog page')).toBeInTheDocument()
    expect(screen.getByText('dummy title 1')).toBeInTheDocument()
    expect(screen.getByText('dummy title 2')).toBeInTheDocument()
  })
})
