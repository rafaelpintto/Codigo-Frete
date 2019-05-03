const puppeteer = require('puppeteer');
const sleep = require('sleep');
const Heroku = require('heroku-client');
const UserAgent = require('user-agents');
const bd = require('../modulos/bd'); // database

puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] }).then(async browser => { // headless: false
    const page = await browser.newPage();
    await listLinks('https://www.fretebras.com.br/fretes', page);
    await browser.close();
});

async function antBot(page){
    const userAgent = await new UserAgent({ deviceCategory: 'desktop'});
    await page.setUserAgent(userAgent.toString());
    return await page;
}

async function listLinks(url, page) {
    if(url !== undefined)
    {
        page = await antBot(page);
        await console.log('l', url);
        await page.goto(url);
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
        
            await sleep.sleep(10);
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
    
    const appName = 'clawler-fretebras';
    const heroku = await new Heroku({ token: process.env.HEROKU_API_TOKEN });
    await heroku.delete('/apps/' + appName + '/dynos/');
}

async function checkIP(page) {
    return (await page.$('td > span.style4 > strong') === null);
}

async function getinfo(url, page) {
    try {
        page = await antBot(page);
        //await console.log('g', url);
        await page.goto(url);
        if(checkIP){
            // image, empresa, produto
            try {
                const info = await page.evaluate((url) => {
                    const cidadeorigem = document.querySelector('div.origem a.cor-vermelho:nth-of-type(1)').textContent
                    const cidadedestino = document.querySelector('div.destino a.cor-vermelho:nth-of-type(1)').textContent
                    const estadoorigem = document.querySelector('div.origem a.cor-vermelho:nth-of-type(2)').textContent
                    const estadodestino = document.querySelector('div.destino a.cor-vermelho:nth-of-type(2)').textContent
                    const km = document.querySelector('.frete-dados.frete-km').textContent
                    const preco = document.querySelector('.frete-dados.frete-preco').textContent
                    const peso = 'N/A';
                    const veiculo = document.querySelector('.frete-dados.frete-veiculos').textContent.split(/[,|\s]+/g)
                    const carroceria = document.querySelector('.frete-dados.frete-carrocerias').textContent.split(/[,|\s]+/g)

                    const info = {
                        url,
                        cidadeorigem,
                        cidadedestino,
                        estadoorigem,
                        estadodestino,
                        km,
                        preco,
                        peso,
                        veiculo,
                        carroceria,
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
    await sleep.sleep(10);
}