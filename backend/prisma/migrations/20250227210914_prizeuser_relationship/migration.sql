-- AddForeignKey
ALTER TABLE "prize_users" ADD CONSTRAINT "prize_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
