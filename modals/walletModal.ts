import { CommoditySettingsTab, DEFAULT_SETTINGS, CURRENCY_MULTIPLIERS, CommoditySettings } from "../options";
import { Modal, App } from "obsidian";
import { getLocalizedText } from "../localization";
import { getCurrencySymbol } from "../main";
import { abbreviateNumber } from "../abbrNum";

export class WalletModal extends Modal {
  value: number;
  currency: string;
  language: string;

  constructor(app: App, value: number, currency: string, language: string) {
    super(app);
    this.value = value;
    this.currency = currency;
    this.language = language;
  }

  onOpen() {
    const { contentEl } = this;
	const currencySymbol = getCurrencySymbol(this.currency);

    let walletValue: number = this.value * (CURRENCY_MULTIPLIERS[currency] || 1);
	const formatter = new Intl.NumberFormat(this.language, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

	var fullValue = Number(walletValue.toFixed(25)); 
	const truncatedValue = Math.trunc(fullValue);
	var formattedValue: string = formatter.format(truncatedValue);

    var valueText: string = `${currencySymbol}${walletValue}`;

	if (walletValue >= 1000000) {
      valueText = `${currencySymbol}${abbreviateNumber(truncatedValue)}`;
    } else if (walletValue >= 1000) {
      valueText = `${currencySymbol}${formattedValue}`;
	}
	  
	contentEl.style.textAlign = "center";
	contentEl.style.fontFamily = "var(--font-interface, var(--default-font))";
	  
    contentEl.createEl("h2", {
	  text: getLocalizedText("walletTitle", this.language),
	  cls: "wallet-header"
	});
    contentEl.createEl("p", {
	  text: valueText,
      cls: "wallet-value"
    });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}
