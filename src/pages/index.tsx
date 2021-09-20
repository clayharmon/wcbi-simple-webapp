import * as React from "react";
import { graphql } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";

const IndexPage = ({ data }) => {
  const posts = data.posts.edges;
  console.log(posts);
  return (
    <div>
      {posts.map((post) => {
        const data = post.node;
        const featuredImage = data.childrenMedia.length
          ? getImage(data.childrenMedia[0]["remoteImage"])
          : false;

        return (
          <article key={data.postId}>
            {featuredImage ? (
              <GatsbyImage
                image={featuredImage}
                alt={data.childrenMedia[0]["alt_text"]}
              />
            ) : null}
            <h3>{data.title.rendered}</h3>
            <div
              dangerouslySetInnerHTML={{ __html: data.excerpt.rendered }}
            ></div>
          </article>
        );
      })}
    </div>
  );
};

export const query = graphql`
  query {
    posts: allPost {
      edges {
        node {
          childrenMedia {
            alt_text
            source_url
            remoteImage {
              childImageSharp {
                gatsbyImageData
              }
            }
          }
          date
          content {
            rendered
          }
          slug
          title {
            rendered
          }
          excerpt {
            rendered
          }
          postId
        }
      }
    }
  }
`;
export default IndexPage;
