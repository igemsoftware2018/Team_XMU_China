import sun.misc.BASE64Encoder;
import sun.misc.BASE64Decoder;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.io.InputStream;
import java.io.FileReader;
import java.io.BufferedReader;
import java.io.InputStreamReader;

public class string2image{
    public static boolean generateImage(String imgStr, String filename) {
        if (imgStr == null) {
            return false;
        }
        BASE64Decoder decoder = new BASE64Decoder();
        try {
            byte[] b = decoder.decodeBuffer(imgStr);
            for(int i = 0; i < b.length; ++i) {
                if (b[i] < 0) {
                    b[i] += 256;
                }
            }
            OutputStream out = new FileOutputStream("./"+filename);
            out.write(b);
            out.flush();
            out.close();
            return true;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return false;
    }
    public static void main(String[] args) {
		String fileName = "/home/ubuntu/socket/1.txt";
   			BufferedReader br = null;
		StringBuffer sb = null;
		try {
			br = new BufferedReader(new InputStreamReader(new FileInputStream(fileName),"GBK")); 
			sb = new StringBuffer();
			String line = null;
			while((line = br.readLine()) != null) {
				sb.append(line);
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				br.close();
			} catch (Exception e) {
				e.printStackTrace();
			}	
		}
		
		String imageStr = new String(sb); 
        boolean generateImage = generateImage(imageStr, "/image/1.jpg");
        System.out.println(generateImage);
    }
}
