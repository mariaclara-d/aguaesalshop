import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function enviarEmailNovoPedido(order: {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  items: { name: string; price: number; quantity: number }[]
  shipping_option: { company: string; name: string; price: string; delivery_time: number }
  total: number
  payment_method: string
}) {
  const itensHtml = order.items.map(item =>
    `<tr>
      <td style="padding:8px;border-bottom:1px solid #f0f0f0">${item.name} × ${item.quantity}</td>
      <td style="padding:8px;border-bottom:1px solid #f0f0f0;text-align:right">
        ${(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </td>
    </tr>`
  ).join('')

  await resend.emails.send({
    from: 'Água e Sal Joias <onboarding@resend.dev>',
    to: 'aguaesal925@gmail.com',
    subject: `🛍️ Novo pedido recebido — ${order.customer_name}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#333">
        <div style="background:#1e3a5f;padding:24px;text-align:center">
          <h1 style="color:#c9a96e;margin:0;font-size:24px">Água e Sal Joias</h1>
          <p style="color:#fff;margin:8px 0 0">Novo pedido recebido!</p>
        </div>

        <div style="padding:24px">
          <h2 style="color:#1e3a5f;margin-top:0">Pedido confirmado ✓</h2>

          <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
            <tr><td style="padding:6px 0;color:#666">Cliente</td><td style="padding:6px 0;font-weight:bold">${order.customer_name}</td></tr>
            <tr><td style="padding:6px 0;color:#666">E-mail</td><td style="padding:6px 0">${order.customer_email}</td></tr>
            <tr><td style="padding:6px 0;color:#666">Telefone</td><td style="padding:6px 0">${order.customer_phone}</td></tr>
            <tr><td style="padding:6px 0;color:#666">Pagamento</td><td style="padding:6px 0">${order.payment_method === 'pix' ? 'PIX' : 'Cartão de crédito'}</td></tr>
          </table>

          <h3 style="color:#1e3a5f">Endereço de entrega</h3>
          <p style="color:#666;margin:0">${order.shipping_address}</p>

          <h3 style="color:#1e3a5f">Itens do pedido</h3>
          <table style="width:100%;border-collapse:collapse">
            ${itensHtml}
            <tr>
              <td style="padding:8px;color:#666">Frete — ${order.shipping_option.company} ${order.shipping_option.name}</td>
              <td style="padding:8px;text-align:right;color:#666">
                ${Number(order.shipping_option.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </td>
            </tr>
            <tr style="background:#f8f5f0">
              <td style="padding:10px 8px;font-weight:bold;color:#1e3a5f">Total</td>
              <td style="padding:10px 8px;text-align:right;font-weight:bold;color:#1e3a5f">
                ${Number(order.total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </td>
            </tr>
          </table>

          <div style="margin-top:24px;padding:16px;background:#f8f5f0;border-radius:4px">
            <p style="margin:0;color:#666;font-size:14px">
              Acesse o <a href="https://aguaesalpratas.com.br/admin/pedidos" style="color:#1e3a5f">painel admin</a> para gerenciar este pedido.
            </p>
          </div>
        </div>
      </div>
    `,
  })
}
