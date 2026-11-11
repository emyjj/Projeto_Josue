const enviarArquivo = async (buffer, mimetype, pasta) => {
    const chave = `${pasta}/${crypto.randomUUID()}-${EXTENSOES[mimetype]}`;
    await s3.send(new PutObjectCommand({
        Bucket: BUCKET, Key: chave, Body: buffer, ContentType: mimetype,
    }));
    return chave;
}

const gerarLink = async (chave) => {
    return await getSignedUrl(s3,
         new GetObjectCommand({ Bucket: BUCKET, Key: chave }),
          { expiresIn: EXPIRACAO_LINK});
};