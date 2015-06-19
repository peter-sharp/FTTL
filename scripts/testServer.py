
import SimpleHTTPServer, BaseHTTPServer
import socket
import thread

import sys, os, shutil, glob, webbrowser

from string import Template










class StoppableHTTPServer(BaseHTTPServer.HTTPServer):

    def server_bind(self):
        BaseHTTPServer.HTTPServer.server_bind(self)
        self.socket.settimeout(1)
        self.run = True

    def get_request(self):
        while self.run:
            try:
                sock, addr = self.socket.accept()
                sock.settimeout(None)
                return (sock, addr)
            except socket.timeout:
                pass

    def stop(self):
        self.run = False

    def serve(self):
        while self.run:
            self.handle_request()




def createTmpFiles(source_dir = "../" ,dest_dir = "./tmp", extension = "*.html"):

    """copies files of a given extension to a given destination"""

    files = glob.iglob(os.path.join(source_dir, extension))

    if not os.path.exists(dest_dir):
        os.makedirs(dest_dir)

    for file in files:
        if os.path.isfile(file):
            shutil.copy2(file, dest_dir)

def launchWebBrowser(PORT):
    chrome = webbrowser.get('google-chrome')
    address = Template("http://localhost:$port").substitute(port=PORT)
    chrome.open_new(address)

def deleteTmpFiles(directory = "./tmp"):
    shutil.rmtree(directory)

def getPort():
    port = 0

    if sys.argv[1:]:

        port = int(sys.argv[1])

    else:
        port = 8000

    return port

def main():

    PORT = getPort()
    HandlerClass = SimpleHTTPServer.SimpleHTTPRequestHandler

    print PORT

    httpd = StoppableHTTPServer(("",PORT), HandlerClass)


    createTmpFiles()
    thread.start_new_thread(httpd.serve, ())

    launchWebBrowser(PORT)
    raw_input("press <Enter> to stop server\n")
    httpd.stop()

    deleteTmpFiles()

if __name__ == '__main__':
    main()
