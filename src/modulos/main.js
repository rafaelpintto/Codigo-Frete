const puppeteer = require('puppeteer');
const sleep = require('sleep');
const Heroku = require('heroku-client');
const bd = require('../modulos/bd'); // database


puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] }).then(async browser => {
    var page = await browser.newPage();
    await page.setViewport({width: 320, height: 600})
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 9_0_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13A404 Safari/601.1')
  
    await listLinks('https://www.fretebras.com.br/fretes', page);
    await browser.close();
});

async function listLinks(url, page) {
    if(url !== undefined)
    {
        await console.log('l', url);
        await page.goto(url, {waitUntil: 'networkidle0'});
        if(checkIP)
        {
            const base = 'https://www.fretebras.com.br';   
            let next = 'https://www.fretebras.com.br/fretes';
        
            if (await page.$('.lista-pg-prox.dis') === null) {
                const filtro = await page.evaluate(base => Array.from( document.querySelectorAll('div#corpo-lista-pg > a'), (element => base + element.getAttribute('href'))), base);
                next = await filtro.reverse()[0];
            }
            
            const links = await page.evaluate(base => Array.from( document.querySelectorAll( '.col5-quadro-imagem a' ), (element => base + '/' + element.getAttribute('href'))), base);
            for(let index = 0; index < links.length; index++) if(await !!bd.Checkdb(links[index])) await getinfo(links[index], page);
        
            await sleep.sleep(20);
            await listLinks(next, page);
        }
        else await restartApp();
    }
    else await restartApp();
}
/*
async function checkExist(page){
    return (await page.$('td > span.style4 > strong') === null);
}
*/

async function restartApp(){
    await console.log('Restart App, IP BAN');
    
    var appName = 'clawler-fretebras';
    var heroku = await new Heroku({ token: process.env.HEROKU_API_TOKEN });
    await heroku.delete('/apps/' + appName + '/dynos/');
}

async function checkIP(page) {
    return (await page.$('td > span.style4 > strong') === null);
}

async function getinfo(url, page) {
    try {
        await console.log('g', url);
        await page.goto(url, {waitUntil: 'networkidle0'});
        if(checkIP){
            // image, empresa, produto
            try {
                const info = await page.evaluate((url) => {
                    const ocidade = document.querySelector('div.origem a.cor-vermelho:nth-of-type(1)').textContent
                    const oestado = document.querySelector('div.origem a.cor-vermelho:nth-of-type(2)').textContent
                    const origem = ocidade + '/' + oestado
                    const dcidade = document.querySelector('div.destino a.cor-vermelho:nth-of-type(1)').textContent
                    const destado = document.querySelector('div.destino a.cor-vermelho:nth-of-type(1)').textContent
                    const destino = dcidade + '/' + destado
                    const km = document.querySelector('.frete-dados.frete-km').textContent
                    let preco = document.querySelector('.frete-dados.frete-preco').textContent
                    const peso = 'N/A';
                    const veiculo = document.querySelector('.frete-dados.frete-veiculos').textContent // loop array
                    
                    const info = {
                        url,
                        origem,
                        destino,
                        km,
                        preco,
                        peso,
                        veiculo,
                        site: 'fretebras'
                    }
                    return info;
                }, url);
                await bd.Insertdb(info);   
            } 
            catch (error) { await restartApp(); }
        }
        else await restartApp();
    } 
    catch (error) { 
        await console.log('deu ruim',url, error); 
    }
    await sleep.sleep(20);
}