/**
 * Feitiva — configuração do site institucional
 * ---------------------------------------------------------------------------
 * Preencha apenas com dados reais. Campos vazios não aparecem no site.
 */
window.FEITIVA_SITE_CONFIG = {
  contact: {
    // E-mail comercial (aparece no contato e no rodapé)
    email: "contact.feitiva@gmail.com",
    // WhatsApp: somente dígitos, com DDI e DDD. Ex.: "5511999999999"
    whatsapp: "",
    // Como o número deve aparecer na tela. Ex.: "(11) 99999-9999"
    whatsappDisplay: ""
  },

  form: {
    // Endereço que recebe as mensagens do formulário (POST em JSON).
    // Enquanto estiver vazio, o formulário abre o e-mail do visitante com a
    // mensagem pronta para o endereço acima. Sem nenhum dos dois, o envio
    // fica indisponível e o site informa isso ao visitante.
    endpointUrl: ""
  }
};
