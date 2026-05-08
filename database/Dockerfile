FROM mysql:8.4.5

COPY mysql.cnf /etc/mysql/conf.d/mysql.cnf
RUN chmod 644 /etc/mysql/conf.d/mysql.cnf

COPY init.sql.template /init-template/init.sql.template

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["sh", "/entrypoint.sh"]
CMD ["mysqld"]