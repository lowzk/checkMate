import logging
from telegram import Update
from telegram.ext import ApplicationBuilder, ContextTypes, CommandHandler
from credentials import BOT_TOKEN;
from texts import START_TEXT, ONBOARD_TEXT;

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await context.bot.send_message(chat_id=update.effective_chat.id, text=START_TEXT)
    
async def onboard(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await context.bot.send_message(chat_id=update.effective_chat.id, text=ONBOARD_TEXT)
    
# async def new_msg(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
#     """Sends a message with three inline buttons attached."""
#     keyboard = [
#         [
#             InlineKeyboardButton("Yes, I would love to!", callback_data="1"), //send scam msg to be checked
#             InlineKeyboardButton("Another day :(", callback_data="2"),
#         ],
#     ]

#     reply_markup = InlineKeyboardMarkup(keyboard)

#     await update.message.reply_text("New Message Received. Would you like to assess it?", reply_markup=reply_markup)
    
# async def button(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
#     """Parses the CallbackQuery and updates the message text."""
#     query = update.callback_query

#     await query.answer()

#     await query.edit_message_text(text=f"Selected option: {query.data}")
    
async def unknown(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await context.bot.send_message(chat_id=update.effective_chat.id, text="Sorry, I didn't understand that command.")

if __name__ == '__main__':
    application = ApplicationBuilder().token(BOT_TOKEN).build()
    
    start_handler = CommandHandler('start', start)
    onboard_handler = CommandHandler('onboard', onboard)
    unknown_handler = CommandHandler('unknown', unknown)
    
    application.add_handler(start_handler)
    application.add_handler(onboard_handler)
    application.add_handler(unknown_handler)
    # application.add_handler(CallbackQueryHandler(button))
    
    application.run_polling()