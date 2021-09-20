const axios = require("axios").default;
const { createRemoteFileNode } = require("gatsby-source-filesystem");

const API_BASE = `https://www.wcbi.com/wp-json/wp/v2`;

const POST_ENDPOINT = `${API_BASE}/posts`;
const MEDIA_ENDPOINT = `${API_BASE}/media`;

const processNode = (item, type, createNodeId, createContentDigest) => {
  const nodeContent = JSON.stringify(item);
  const nodeMeta = {
    id: createNodeId(`wp-post-${item.id}`),
    parent: null,
    children: [],
    internal: {
      type,
      content: nodeContent,
      contentDigest: createContentDigest(item),
    },
  };
  const node = Object.assign({}, { postId: item.id, ...item }, nodeMeta);
  return node;
};

exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
}) => {
  const { createNode } = actions;
  // Download data from a remote API.
  const { data } = await axios.get(POST_ENDPOINT);
  // Process data and create nodes.using a custom processDatum function
  data.forEach((post) =>
    createNode(processNode(post, `Post`, createNodeId, createContentDigest))
  );
  return;
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;

  createTypes(`
    type Media implements Node {
      remoteImage: File @link
    }
    `);
};

exports.onCreateNode = async ({
  node,
  actions,
  createNodeId,
  createContentDigest,
  cache,
  store,
}) => {
  function transformObject(obj, id, type) {
    const yamlNode = {
      ...obj,
      id,
      children: [],
      parent: node.id,
      internal: {
        contentDigest: createContentDigest(obj),
        type,
      },
    };
    createNode(yamlNode);
    createParentChildLink({ parent: node, child: yamlNode });
  }
  const { createNode, createParentChildLink } = actions;
  if (node.internal.type === `Post`) {
    const url = `${MEDIA_ENDPOINT}?parent=${node.postId}`;
    console.log(url);
    const { data } = await axios.get(url);
    data.forEach((obj) => {
      transformObject(obj, createNodeId(`wp-media-${obj.id}`), `Media`);
    });
    return;
  }

  if (node.internal.type === `Media`) {
    const fileNode = await createRemoteFileNode({
      url: node.source_url,
      parentNodeId: node.id,
      createNode,
      createNodeId,
      cache,
      store,
    });
    if (fileNode) {
      node.remoteImage = fileNode.id;
    }
  }
};
