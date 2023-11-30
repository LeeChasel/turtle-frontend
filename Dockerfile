FROM nginx:alpine

# Clean nginx
RUN rm -rf /usr/share/nginx/html/* && \
    rm -rf /etc/nginx/conf.d/*

# Copy files
COPY dist/ /usr/share/nginx/html

# Permission
RUN chown root /usr/share/nginx/html/*
RUN chmod 755 /usr/share/nginx/html/*