function generateStripeCardData(tokenData, authUser, cardName) {
    const cardData = tokenData.token.card;
    console.log(cardData)
    const fullName = authUser.full_name;
    return {
        stripeToken: tokenData.token.id,
        stripeEmail: authUser.email,
        holderName: fullName,
        user_id: authUser.id,
        exp_month: cardData.exp_month,
        exp_year: cardData.exp_year,
        last4: cardData.last4,
        brand: cardData.brand,
        country: cardData.country,
        fingerprint: cardData.fingerprint,
        name: cardName
    };
}

export {generateStripeCardData as generateStripeCardData};
