import type { Product } from '../types'

type HomePageProps = {
  products: Product[]
}

const priceFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
})

export function HomePage({ products }: HomePageProps) {
  return (
    <main className="home-layout page-enter">
      <section className="panel product-panel">
        <div className="section-head">
          <div>
            <p className="eyebrow">Bộ sưu tập công nghệ</p>
            <h2>{products.length} sản phẩm nổi bật trên NovaTech</h2>
          </div>
          <span>{products.length} sản phẩm</span>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-media">
                <img src={product.imageUrl} alt={product.name} loading="lazy" />
                {product.badge ? <span className="product-badge">{product.badge}</span> : null}
              </div>

              <div className="product-content">
                <div className="product-topline">
                  <span>{product.category}</span>
                  <strong>{product.stock > 0 ? `Còn ${product.stock}` : 'Hết hàng'}</strong>
                </div>

                <h3>{product.name}</h3>
                <p>{product.description}</p>

                <div className="product-footer">
                  <strong>{priceFormatter.format(product.price)}</strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
