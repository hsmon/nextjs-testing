import Link from 'next/link'
import Layout from '../../components/Layout'
import { getAllIds, getPostData } from '../../lib/fetch'
import { POST } from '../../types/Types'
import { GetStaticProps, GetStaticPaths } from 'next'

const PostDetail: React.FC<POST> = ({ id, title, body }) => {
  return (
    <Layout title={title}>
      <p className="m-4">
        {'ID : '}
        {id}
      </p>
      <p className="mb-4 text-xl font-bold">{title}</p>
      <p className="x-10">{body}</p>
      <Link href="/blog-page">
        <div className="flex cursor-pointer mt-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6 mr-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16l-4-4m0 0l4-4m-4 4h18"
            />
          </svg>
          <a data-testid="back-blog">Back to blog-page</a>
        </div>
      </Link>
    </Layout>
  )
}
export default PostDetail

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getAllIds()
  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const post = await getPostData(ctx.params.id as string)
  return {
    props: {
      ...post,
    },
  }
}
