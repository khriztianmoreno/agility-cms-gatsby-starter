import React from 'react';
import { Link, graphql, StaticQuery } from 'gatsby'
import { cleanHTML} from '../agility/utils'
import truncate from 'truncate-html'
import Img from 'gatsby-image'
import './ProductListing.css'

export default (props) => (
	<StaticQuery
		query={graphql`
        query ProductListingModuleQuery {
            allAgilityProduct(
              filter: {
                properties: { referenceName: { eq: "productsdynamiclist"}}
              },
              limit: 10
            ) {
                totalCount
                nodes {
                    contentID
                    customFields {
                        title2
                        price
                        imageLocalImg {
                            childImageSharp {
                                fluid(quality: 90, maxWidth: 480, maxHeight: 350) {
                                  ...GatsbyImageSharpFluid
                                }
                              }
                        }
                    }
                    properties {
                        referenceName
                    }
                }
            }
          }
        `}
		render={queryData => {
			return (
				<ProductsListing products={queryData.allAgilityProduct.nodes} {...props} />
			);
		}}
	/>
)

const ProductsListing = ({ item, products }) => {
    return (
        <section className="Products-listing" >
            <div className="container">
                <div className="Products-listing-container">
                    <ProductsComponent products={products} />
                </div>
            </div>
        </section>
    )
}

const ProductsComponent = ({ products }) => {
    return products.map(product => {
      return <Product product={product} />;
    })
}

const Product = ({ product }) => {
    return(
        <div className="Product">
            <h2>{product.customFields.title2}</h2>
              <h2>{product.customFields.price}</h2>
              <ProductImage image={product.customFields.imageLocalImg} label={product.customFields.image ? product.customFields.image.label : `Product Image`} />
        </div>
    )
}

const ProductImage = ({ image, label }) => {
    let imageToRender = null;

    if(image && image.childImageSharp) {

        imageToRender = <Img fluid={image.childImageSharp.fluid} alt={label} />
    }
    return imageToRender;
}

const ProductExceprt = ({ htmlContent }) => {
    const renderHTML = () => {
        const excerpt = truncate(cleanHTML(htmlContent), { stripTags: true, length: 160 });
		return { __html: excerpt };
    }
    return(<p dangerouslySetInnerHTML={renderHTML()}></p>)
}
