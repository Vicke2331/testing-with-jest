const { Builder, By, until } = require('selenium-webdriver');
require('geckodriver');


const firefox = require('selenium-webdriver/firefox');
const firefoxPath = 'C:\\Program Files\\Mozilla Firefox\\firefox.exe';
const service = new firefox.ServiceBuilder('./geckodriver.exe');

// Här anger vi var testfilen ska hämtas. De konstiga replaceAll-funktionerna ersätter
// mellanslag med URL-säkra '%20' och backslash (\) på Windows med slash (/).
const fileUnderTest = 'file://' + __dirname.replaceAll(/ /g, '%20').replaceAll(/\\/g, '/') + '/../dist/index.html';
const defaultTimeout = 10000;
let driver;
jest.setTimeout(1000 * 60 * 5); // 5 minuter

// Det här körs innan vi kör testerna för att säkerställa att Firefox är igång
beforeAll(async () => {
console.log(fileUnderTest);
    driver = await new Builder().forBrowser('firefox')
        .setFirefoxService(service)
        .setFirefoxOptions(new firefox.Options().setBinary(firefoxPath))
        .build();
    await driver.get(fileUnderTest);
});

// Allra sist avslutar vi Firefox igen
afterAll(async() => {
    await driver.quit();
}, defaultTimeout);

test('The stack should be empty in the beginning', async () => {
    let stack = await driver.findElement(By.id('top_of_stack')).getText();
    expect(stack).toEqual("n/a");
});

describe('Clicking "Pusha till stacken"', () => {
    it('should open a prompt box', async () => {
        let push = await driver.findElement(By.id('push'));
        await push.click();
        let alert = await driver.switchTo().alert();
        await alert.sendKeys("Bananer");
        await alert.accept();
    });
});


test('After pushing and popping, stack should be n/a again', async()=>{
    const push = await driver.findElement(By.id('push'));
    await push.click();

    const alert = await driver.switchTo().alert();
    await alert.sendKeys("testvärde");
    await alert.accept();

    const pop = await driver.findElement(By.id('pop'));
    await pop.click();

    const peek = await driver.findElement(By.id('peek'));
    await peek.click();

    const result = await driver.findElement(By.id('top_of_stack')).getText();
    expect(result).toBe("n/a");

})